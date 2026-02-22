import os
import re
import pandas as pd
from pathlib import Path
from typing import List, Dict, Any

def parse_time_to_seconds(time_str: str) -> float:
    """
    Convert time strings like '1 min 35 sec' or '45.6 sec' to float seconds.
    
    Args:
        time_str: Time string in various formats
        
    Returns:
        float: Time in seconds
    """
    if not time_str or not isinstance(time_str, str):
        return 0.0
        
    time_str = time_str.lower().strip()
    total_seconds = 0.0
    
    try:
        # Handle 'X min Y sec'
        min_match = re.search(r'(\d+)\s*min', time_str)
        if min_match:
            total_seconds += int(min_match.group(1)) * 60
        
        # Handle 'X.X sec' or 'X sec'
        sec_match = re.search(r'(\d+(?:\.\d+)?)\s*sec', time_str)
        if sec_match:
            total_seconds += float(sec_match.group(1))
            
        return total_seconds
    except (ValueError, AttributeError) as e:
        print(f"Error parsing time string '{time_str}': {e}")
        return 0.0

def parse_quiz_results(file_path: str) -> List[Dict[str, Any]]:
    """
    Parse quiz results from cleaned text file.
    
    The cleaned file contains quiz results in format:
    🥇 @username – score (time)
    🥈 @username – score (time) 
    🥉 @username – score (time)
     4.  @username – score (time)
    
    Args:
        file_path: Path to the cleaned quiz data file
        
    Returns:
        List of dictionaries with quiz result data
    """
    quiz_results = []
    
    # Pattern to match quiz result lines
    # Matches: 🥇/@username, 🥈/@username, 🥉/@username, or numbered positions
    result_pattern = re.compile(r'^\s*(?:🥇|🥈|🥉|\d+\.)\s*(@\S+|[^\u2013\n]+)\s*\u2013\s*(\d+)\s*\((.*?)\)')
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        for line_num, line in enumerate(lines, 1):
            line = line.strip()
            if not line:
                continue
                
            match = result_pattern.match(line)
            if match:
                try:
                    username = match.group(1).strip().replace('@', '')
                    score = int(match.group(2))
                    time_raw = match.group(3)
                    time_sec = parse_time_to_seconds(time_raw)
                    
                    # Validate data
                    if username and score >= 0 and time_sec >= 0:
                        quiz_results.append({
                            'Username': username,
                            'Score': score,
                            'Seconds': time_sec,
                            'Time_Raw': time_raw
                        })
                    else:
                        print(f"Warning: Invalid data on line {line_num}: '{line}'")
                        
                except (ValueError, AttributeError) as e:
                    print(f"Error parsing line {line_num}: '{line}' - {e}")
                    continue

        print(f"Successfully parsed {len(quiz_results)} quiz results from {len(lines)} lines")
        return quiz_results
        
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return []

def calculate_cumulative_leaderboard(quiz_results: List[Dict[str, Any]]) -> pd.DataFrame:
    """
    Calculate cumulative leaderboard from individual quiz results.
    
    This function:
    1. Groups results by username
    2. Calculates participation count, total score, average time
    3. Computes weighted scores (participation, accuracy, speed)
    4. Applies ranking and remarks
    
    Args:
        quiz_results: List of individual quiz results
        
    Returns:
        DataFrame with cumulative leaderboard data
    """
    if not quiz_results:
        print("No quiz results to process")
        return pd.DataFrame()

    # Convert to DataFrame for easier manipulation
    df = pd.DataFrame(quiz_results)
    
    # Group by username and calculate aggregates
    agg_df = df.groupby('Username').agg(
        Quizzes_Participated=('Score', 'count'),
        Total_Score=('Score', 'sum'),
        Total_Seconds=('Seconds', 'sum')
    ).reset_index()
    
    # Calculate averages
    agg_df['Avg_Points'] = agg_df['Total_Score'] / agg_df['Quizzes_Participated']
    agg_df['Avg_Time'] = agg_df['Total_Seconds'] / agg_df['Quizzes_Participated']
    
    # Calculate weighted scores with safety checks
    max_participation = agg_df['Quizzes_Participated'].max()
    max_avg_points = agg_df['Avg_Points'].max()
    
    # Participation Score (50% weight): Based on quiz participation count
    agg_df['Participation_Score'] = (agg_df['Quizzes_Participated'] / max_participation * 50) if max_participation > 0 else 0
    
    # Accuracy Score (25% weight): Based on average points per quiz
    agg_df['Accuracy_Score'] = (agg_df['Avg_Points'] / max_avg_points * 25) if max_avg_points > 0 else 0
    
    # Speed Score (25% weight): Based on average completion time
    def calculate_speed_score(avg_time):
        if avg_time <= 50:  # Excellent speed (under 50 seconds)
            return 25.0
        # Slower speed gets lower score (inverse relationship)
        return (50 / avg_time) * 25 if avg_time > 0 else 0

    agg_df['Speed_Score'] = agg_df['Avg_Time'].apply(calculate_speed_score)
    
    # Final Score: Sum of all weighted components
    agg_df['Final_Score'] = agg_df['Participation_Score'] + agg_df['Accuracy_Score'] + agg_df['Speed_Score']
    
    # Sort by multiple criteria for deterministic ranking
    agg_df = agg_df.sort_values(
        by=['Final_Score', 'Avg_Points', 'Avg_Time', 'Quizzes_Participated'],
        ascending=[False, False, True, False]
    )
    
    # Add rank
    agg_df['Rank'] = range(1, len(agg_df) + 1)
    
    # Add star ratings based on final score
    def get_star_rating(score):
        if score >= 90: 
            return "10🌟"  # 10 stars
        elif score >= 80: 
            return "9🌟"     # 9 stars
        elif score >= 70: 
            return "8🌟"        # 8 stars
        elif score >= 60: 
            return "7🌟"           # 7 stars
        elif score >= 50: 
            return "6🌟"              # 6 stars
        elif score >= 40: 
            return "5🌟"                 # 5 stars
        elif score >= 30: 
            return "4🌟"                    # 4 stars
        elif score >= 20: 
            return "3🌟"                       # 3 stars
        elif score >= 10: 
            return "2🌟"                          # 2 stars
        else: 
            return "1🌟"                             # 1 star

    agg_df['Remark'] = agg_df['Final_Score'].apply(get_star_rating)
    
    # Select and reorder columns for final output
    final_columns = ['Rank', 'Username', 'Quizzes_Participated', 'Avg_Points', 'Avg_Time', 'Final_Score', 'Remark']
    result_df = agg_df[final_columns].copy()
    
    # Round numerical values for cleaner output
    result_df['Avg_Points'] = result_df['Avg_Points'].round(2)
    result_df['Avg_Time'] = result_df['Avg_Time'].round(1)
    result_df['Final_Score'] = result_df['Final_Score'].round(2)
    
    return result_df

def convert_to_csv(input_file: str, output_file: str = None) -> str:
    """
    Convert cleaned quiz data to cumulative leaderboard CSV.
    
    Args:
        input_file: Path to cleaned quiz data file
        output_file: Optional output CSV path (auto-generated if not provided)
        
    Returns:
        str: Path to generated CSV file
    """
    # Generate output filename if not provided
    if output_file is None:
        input_path = Path(input_file)
        output_file = input_path.parent / f"{input_path.stem}_leaderboard.csv"
    
    print(f"Converting {input_file} to CSV...")
    
    # Parse quiz results
    quiz_results = parse_quiz_results(input_file)
    
    if not quiz_results:
        print("No valid quiz results found")
        return None
    
    # Calculate cumulative leaderboard
    leaderboard_df = calculate_cumulative_leaderboard(quiz_results)
    
    if leaderboard_df.empty:
        print("Failed to generate leaderboard")
        return None
    
    # Save to CSV
    try:
        leaderboard_df.to_csv(output_file, index=False, encoding='utf-8')
        print(f"Successfully saved leaderboard to: {output_file}")
        print(f"Total participants: {len(leaderboard_df)}")
        
        # Show top 5 results
        print("\nTop 5 participants:")
        print(leaderboard_df.head().to_string(index=False))
        
        return str(output_file)
        
    except Exception as e:
        print(f"Error saving CSV: {e}")
        return None

if __name__ == "__main__":
    # Default input file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    default_input = os.path.join(script_dir, '..', 'data', 'processed', 'MattewMarkLuke_cleaned.txt')
    
    # Allow command line override
    import sys
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    else:
        input_file = default_input
    
    # Convert to CSV
    result = convert_to_csv(input_file)
    
    if result:
        print(f"\nConversion completed successfully!")
        print(f"CSV file saved at: {result}")
    else:
        print("\nConversion failed!")
