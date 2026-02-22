# Complete Quiz Data Processing Pipeline Documentation

## Overview
This document outlines the complete pipeline for processing raw quiz data into a ranked leaderboard with star ratings. The system is designed to be reusable across different quiz datasets and formats.

## Pipeline Architecture

```
Raw Quiz Data → Data Cleaning → CSV Conversion → Leaderboard Generation
```

## Phase 1: Data Cleaning

### Input Format
Raw quiz data files typically contain:
- Metadata lines (emojis, timestamps, headers)
- Quiz results in various formats
- Empty lines and formatting artifacts

### Cleaning Process

#### 1. Metadata Removal
**Purpose**: Remove non-quiz content while preserving all relevant results

**Removed Elements**:
- Emoji metadata lines: `🖊`, `🏆`, `⏱`, `🤓`
- Chapter headers: Lines containing Ethiopian chapter markers
- Quiz titles: Lines containing "Top results in the quiz"
- Timestamp lines: Lines starting with "Yonas Aye, [", and other irrelevant details that does not start with 🥇, 🥈, 🥉, or numbers
- Empty lines: All blank lines

#### 2. Format Standardization
**Purpose**: Ensure consistent spacing between quiz sections

**Rules**:
- **Quiz Transitions**: Force 2 empty lines between numbered rankings and new quiz sections (🥇 transitions)
- **Contiguous Rankings**: Remove empty lines between consecutive numbered rankings to maintain list continuity
- **Content Preservation**: Maintain all quiz result data with original formatting

#### 3. Validation
**Purpose**: Ensure data integrity and completeness

**Checks**:
- Line count tracking through each processing stage
- Quiz result pattern validation
- Error reporting for invalid formats

### Output
Cleaned text file with only quiz results in standardized format:
```
🥇 username – score (time)
🥈 username – score (time)
🥉 username – score (time)
 4.  username – score (time)
```

## Phase 2: CSV Conversion & Ranking

### Data Parsing

#### Time Parsing
**Function**: `parse_time_to_seconds(time_str)`

**Input Formats Supported**:
- "X min Y sec" (e.g., "1 min 35 sec")
- "X.X sec" (e.g., "45.6 sec")
- "X sec" (e.g., "30 sec")

**Process**:
1. Extract minutes using regex: `(\d+)\s*min`
2. Extract seconds using regex: `(\d+(?:\.\d+)?)\s*sec`
3. Convert to total seconds: `minutes * 60 + seconds`

#### Quiz Result Parsing
**Pattern**: `^\s*(?:🥇|🥈|🥉|\d+\.)\s*(@\S+|[^\u2013\n]+)\s*\u2013\s*(\d+)\s*\((.*?)\)`

**Extracted Fields**:
- Username (strips @ prefix)
- Score (integer)
- Time (raw string, converted to seconds)

### Aggregation & Scoring

#### User-Level Aggregation
**Calculations per User**:
- `Quizzes_Participated`: Count of quiz attempts
- `Total_Score`: Sum of all scores
- `Total_Seconds`: Sum of all completion times
- `Avg_Points`: `Total_Score / Quizzes_Participated`
- `Avg_Time`: `Total_Seconds / Quizzes_Participated`

#### Weighted Scoring System
**Maximum Score**: 100 points

**Components**:
1. **Participation Score (50% weight)**
   - Formula: `(User_Quizzes / Max_Quizzes) × 50`
   - Rewards consistent participation

2. **Accuracy Score (25% weight)**
   - Formula: `(User_Avg_Points / Max_Avg_Points) × 25`
   - Rewards high average scores

3. **Speed Score (25% weight)**
   - Formula: `25.0` if `Avg_Time ≤ 50` seconds
   - Formula: `(50 / Avg_Time) × 25` if `Avg_Time > 50` seconds
   - Rewards fast completion times

**Final Score**: `Participation_Score + Accuracy_Score + Speed_Score`

### Ranking Algorithm

#### Sorting Criteria
1. **Primary**: Final_Score (descending)
2. **Secondary**: Avg_Points (descending)
3. **Tertiary**: Avg_Time (ascending)
4. **Quaternary**: Quizzes_Participated (descending)

#### Rank Assignment
- Sequential ranking: 1, 2, 3, ...
- No gaps in ranking numbers
- Deterministic tie-breaking through sort criteria

### Star Rating System

#### Score-to-Star Mapping
- **≥ 90 points**: 10🌟
- **≥ 80 points**: 9🌟
- **≥ 70 points**: 8🌟
- **≥ 60 points**: 7🌟
- **≥ 50 points**: 6🌟
- **≥ 40 points**: 5🌟
- **≥ 30 points**: 4🌟
- **≥ 20 points**: 3🌟
- **≥ 10 points**: 2🌟
- **< 10 points**: 1🌟

#### Purpose
- Visual performance indicator
- Motivational progression system
- Easy performance level identification

## Phase 3: Output Generation

### CSV Structure
**Columns**: `Rank,Username,Quizzes_Participated,Avg_Points,Avg_Time,Final_Score,Remark`

**Data Formatting**:
- Avg_Points: Rounded to 2 decimal places
- Avg_Time: Rounded to 1 decimal place
- Final_Score: Rounded to 2 decimal places
- Remark: Star rating (1🌟 to 10🌟)

### File Organization
```
data/
├── raw/                    # Original quiz files
├── processed/              # Cleaned text files
└── cumulative_leaderboard.csv  # Final ranking CSV
```

## Reusability Features

### Configurable Elements
1. **Cleaning Patterns**: Regex patterns can be adjusted for different metadata formats
2. **Scoring Weights**: Participation/Accuracy/Speed weights can be modified
3. **Star Thresholds**: Score ranges for star ratings can be customized
4. **Time Thresholds**: Speed bonus cutoff can be adjusted

### Extensibility Points
1. **New Metadata Types**: Additional patterns can be added to cleaning function
2. **Alternative Scoring**: Different scoring algorithms can be implemented
3. **Custom Ratings**: Different rating systems can replace stars
4. **Additional Metrics**: New calculated fields can be added

## Error Handling

### Data Validation
- Invalid time strings default to 0.0 seconds
- Invalid quiz lines are logged but skipped
- Empty files return empty results with warnings

### Processing Errors
- File I/O errors are caught and reported
- Backup files created before cleaning
- Graceful degradation for malformed data

### Logging
- Progress reporting for each processing stage
- Warning messages for data anomalies
- Summary statistics for validation

## Performance Considerations

### Scalability
- Processes large datasets efficiently using pandas
- Memory-efficient line-by-line processing for cleaning
- Vectorized operations for aggregation

### Optimization
- Regex patterns compiled once
- Pandas groupby operations for aggregation
- Minimal data copying during transformation

## Usage Examples

### Basic Processing
```python
# Clean raw data
python optimized_clean.py path/to/raw/file.txt

# Convert to CSV
python convert_to_csv.py path/to/cleaned/file.txt
```

### Batch Processing
```python
# Process multiple files
for file in raw_files:
    clean_data(file)
    convert_to_csv(cleaned_file)
```

## Dependencies

### Required Libraries
- `pandas`: Data manipulation and aggregation
- `re`: Regex pattern matching
- `pathlib`: File path handling
- `typing`: Type hints for code clarity

### System Requirements
- Python 3.7+
- UTF-8 file encoding support
- Sufficient memory for large datasets

## Maintenance

### Regular Updates
- Review regex patterns for new metadata formats
- Adjust scoring weights based on feedback
- Update star thresholds for score distribution changes

### Monitoring
- Track processing success rates
- Monitor data quality metrics
- Log performance statistics

This documentation provides a comprehensive foundation for understanding, maintaining, and extending the quiz data processing pipeline across different use cases and datasets.
