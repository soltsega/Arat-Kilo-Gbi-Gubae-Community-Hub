import os
import re
import pandas as pd
import random
from pathlib import Path

def parse_time_to_seconds(time_str):
    if not time_str or not isinstance(time_str, str):
        return 0.0
    time_str = time_str.lower().strip()
    total_seconds = 0.0
    # Handle 'X min Y sec'
    min_match = re.search(r'(\d+)\s*min', time_str)
    if min_match:
        total_seconds += int(min_match.group(1)) * 60
    # Handle 'X.X sec' or 'X sec'
    sec_match = re.search(r'(\d+(?:\.\d+)?)\s*sec', time_str)
    if sec_match:
        total_seconds += float(sec_match.group(1))
    return total_seconds

def generate_acts_rankings(input_file, output_csv, output_md):
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found.")
        return

    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    all_user_entries = []
    current_quiz_participants = set()
    # Marker pattern to detect the start of a quiz result block
    result_pattern = re.compile(r'^\s*(🥇|🥈|🥉|\d+\.)\s*(@\S+|[^\u2013\n]+)\s*\u2013\s*(\d+)\s*\((.*?)\)')

    for line in lines:
        line = line.strip()
        if not line: continue
        match = result_pattern.match(line)
        if match:
            marker = match.group(1)
            username = match.group(2).strip().replace('@', '')
            score = int(match.group(3))
            time_sec = parse_time_to_seconds(match.group(4))
            
            # Logic from generate_combined_rankings.py: 
            # If 🥇 is found, we assume a new quiz block starts.
            if marker == '🥇':
                current_quiz_participants = set()
            
            if username not in current_quiz_participants:
                all_user_entries.append({'Username': username, 'Score': score, 'Seconds': time_sec})
                current_quiz_participants.add(username)

    if not all_user_entries:
        print("No valid quiz data found.")
        return

    df = pd.DataFrame(all_user_entries)
    agg_df = df.groupby('Username').agg(
        Quizzes_Participated=('Score', 'count'),
        Total_Score=('Score', 'sum'),
        Total_Seconds=('Seconds', 'sum')
    ).reset_index()
    
    agg_df['Avg_Points'] = agg_df['Total_Score'] / agg_df['Quizzes_Participated']
    agg_df['Avg_Time'] = agg_df['Total_Seconds'] / agg_df['Quizzes_Participated']
    
    max_part = agg_df['Quizzes_Participated'].max()
    max_acc = agg_df['Avg_Points'].max()
    
    # 50/25/25 Weighted Scoring
    agg_df['Participation_Score'] = (agg_df['Quizzes_Participated'] / max_part) * 50 if max_part > 0 else 0
    agg_df['Accuracy_Score'] = (agg_df['Avg_Points'] / max_acc) * 25 if max_acc > 0 else 0
    agg_df['Speed_Score'] = agg_df['Avg_Time'].apply(lambda t: 25.0 if t <= 50 else (50/t)*25 if t > 0 else 0)
    agg_df['Final_Score'] = agg_df['Participation_Score'] + agg_df['Accuracy_Score'] + agg_df['Speed_Score']
    
    # Star Ratings for Remark Column (Logic from generate_combined_rankings.py)
    def get_stars(score):
        stars = int(score // 10) + 1
        stars = min(max(stars, 1), 10)
        return f"{stars}🌟"

    agg_df['Remark'] = agg_df['Final_Score'].apply(get_stars)
    
    # Deterministic Tie-breaking
    random.seed(42)
    agg_df['Random_Tie'] = [random.random() for _ in range(len(agg_df))]
    agg_df = agg_df.sort_values(
        by=['Final_Score', 'Avg_Points', 'Avg_Time', 'Random_Tie'], 
        ascending=[False, False, True, True]
    )
    agg_df['Rank'] = range(1, len(agg_df) + 1)
    
    # Final Output formatting
    final_output = agg_df[['Rank', 'Username', 'Quizzes_Participated', 'Avg_Points', 'Avg_Time', 'Final_Score', 'Remark']]
    
    # Rounding for output
    final_output_rounded = final_output.round({
        'Avg_Points': 2,
        'Avg_Time': 1,
        'Final_Score': 2
    })
    
    # Save CSV
    final_output_rounded.to_csv(output_csv, index=False)
    print(f"Leaderboard saved to {output_csv}")
    
    # Save Markdown
    with open(output_md, 'w', encoding='utf-8') as md:
        md.write(f"# 🏆 Acts of Apostles Cumulative Leaderboard\n\n")
        md.write("| Rank | Username | Quizzes | Avg Accuracy | Avg Time (s) | Final Score | Remark |\n")
        md.write("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n")
        for _, row in final_output_rounded.iterrows():
            md.write(f"| {int(row['Rank'])} | {row['Username']} | {int(row['Quizzes_Participated'])} | {row['Avg_Points']} | {row['Avg_Time']} | {row['Final_Score']} | {row['Remark']} |\n")
    print(f"Markdown report generated at {output_md}")

if __name__ == "__main__":
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    input_file = project_root / "data" / "processed" / "individual" / "ACTS.txt"
    output_csv = project_root / "data" / "processed" / "ACTS_Leaderboard.csv"
    output_md = project_root / "docs" / "ACTS_Leaderboard.md"
    
    # Ensure directories exist
    output_csv.parent.mkdir(parents=True, exist_ok=True)
    output_md.parent.mkdir(parents=True, exist_ok=True)
    
    generate_acts_rankings(input_file, output_csv, output_md)
