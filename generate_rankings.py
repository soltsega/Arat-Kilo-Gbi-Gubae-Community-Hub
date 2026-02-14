import os
import re
import pandas as pd
import random

def parse_time_to_seconds(time_str):
    """Converts strings like '1 min 35 sec' or '45.6 sec' to float seconds."""
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

def generate_rankings(input_file):
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found.")
        return

    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    user_data = [] # List of dicts for each entry (quiz appearance)
    
    # Regex for results line: 🥇 @user – 5 (30.3 sec) or  4. @user – 5 (35.5 sec)
    # Note: Using \u2013 for the dash (–)
    result_pattern = re.compile(r'^\s*(?:🥇|🥈|🥉|\d+\.)\s*(@\S+|[^\u2013\n]+)\s*\u2013\s*(\d+)\s*\((.*?)\)')

    for line in lines:
        match = result_pattern.match(line)
        if match:
            username = match.group(1).strip().replace('@', '')
            score = int(match.group(2))
            time_raw = match.group(3)
            time_sec = parse_time_to_seconds(time_raw)
            
            user_data.append({
                'Username': username,
                'Score': score,
                'Seconds': time_sec
            })

    if not user_data:
        print("No valid quiz data found.")
        return

    df = pd.DataFrame(user_data)
    
    # Aggregation
    agg_df = df.groupby('Username').agg(
        Quizzes_Participated=('Score', 'count'),
        Total_Score=('Score', 'sum'),
        Total_Seconds=('Seconds', 'sum')
    ).reset_index()
    
    agg_df['Avg_Points'] = agg_df['Total_Score'] / agg_df['Quizzes_Participated']
    agg_df['Avg_Time'] = agg_df['Total_Seconds'] / agg_df['Quizzes_Participated']
    
    # Normalization factors with safety checks
    max_participation = agg_df['Quizzes_Participated'].max()
    max_avg_points = agg_df['Avg_Points'].max()
    min_avg_time = agg_df['Avg_Time'].min()
    
    # Weighted Scoring (50/25/25) with safety checks for zero values
    # 50% Participation: (User Quizzes / Max Quizzes) * 50
    if max_participation > 0:
        agg_df['Participation_Score'] = (agg_df['Quizzes_Participated'] / max_participation) * 50
    else:
        agg_df['Participation_Score'] = 0.0

    # 25% Accuracy (Avg Points): (User Avg Points / Max Avg Points) * 25
    if max_avg_points > 0:
        agg_df['Accuracy_Score'] = (agg_df['Avg_Points'] / max_avg_points) * 25
    else:
        agg_df['Accuracy_Score'] = 0.0

    # 25% Speed: 25 pts for <50s, otherwise (50 / User Avg Time) * 25
    def calculate_speed_score(row):
        if row['Avg_Time'] <= 50:
            return 25.0
        return (50 / row['Avg_Time']) * 25

    agg_df['Speed_Score'] = agg_df.apply(calculate_speed_score, axis=1)
    
    agg_df['Final_Score'] = agg_df['Participation_Score'] + agg_df['Accuracy_Score'] + agg_df['Speed_Score']
    
    # Seed for random tie-breaker
    random.seed(42)
    agg_df['Random_Rank'] = [random.random() for _ in range(len(agg_df))]
    
    # Sort by Final_Score (DESC), then Tie-breakers:
    # 1. Accuracy (Avg_Points) DESC
    # 2. Speed (Avg_Time) ASC
    # 3. Participation DESC
    # 4. Random
    agg_df = agg_df.sort_values(
        by=['Final_Score', 'Avg_Points', 'Avg_Time', 'Quizzes_Participated', 'Random_Rank'],
        ascending=[False, False, True, False, True]
    )
    
    # Final Rank assignment
    agg_df['Rank'] = range(1, len(agg_df) + 1)
    
    # Assign Remarks based on Final_Score
    def get_remark(score):
        if score >= 40:
            return "እግዚአብሔር ያክብራችሁ በርቱ🥰"
        elif 20 <= score < 40:
            return "እንዴ በርቱ እንጂ አሁን F ላይ ናችሁ፤ በቀጣይ NG ነው የሚሆነው🤭"
        else:
            return "እናንተማ እያውደለደላችሁ ነው፤ ሥራህን አውቃለሁ፤ በራድ ወይም ትኩስ እንዳልሆንህ፤ በራድ ወይም ትኩስ ብትሆንስ መልካም በሆነ ነበር። እንዲሁ ለዘብተኛ ስለሆንህ በራድም ወይም ትኩስ ስላልሆንህ ከአፌ ልተፋህ ነው። የተባለው ለናንተ ነው የሚመስለው😂"

    agg_df['Remark'] = agg_df['Final_Score'].apply(get_remark)

    # Reorder columns for output
    final_output = agg_df[[
        'Rank', 'Username', 'Quizzes_Participated', 'Avg_Points', 'Avg_Time', 'Final_Score', 'Remark'
    ]]
    
    # Save CSV
    csv_path = os.path.join("data", "cumulative_leaderboard.csv")
    final_output.to_csv(csv_path, index=False)
    print(f"Leaderboard saved to {csv_path}")
    
    # Save Markdown
    md_path = os.path.join("documentation", "CumulativeLeaderboard.md")
    with open(md_path, 'w', encoding='utf-8') as md:
        md.write("# 🏆 Cumulative Quiz Leaderboard\n\n")
        md.write("| Rank | Username | Quizzes | Avg Accuracy | Avg Time (s) | Final Score | Remark |\n")
        md.write("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n")
        for _, row in final_output.iterrows():
            md.write(f"| {int(row['Rank'])} | {row['Username']} | {int(row['Quizzes_Participated'])} | {row['Avg_Points']:.2f} | {row['Avg_Time']:.2f} | {row['Final_Score']:.2f} | {row['Remark']} |\n")
    
    print(f"Markdown report generated at {md_path}")

if __name__ == "__main__":
    data_file = os.path.join("data", "quizRankData.txt")
    generate_rankings(data_file)
