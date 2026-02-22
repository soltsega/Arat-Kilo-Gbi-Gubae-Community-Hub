import os
import shutil
import sys
import re
from pathlib import Path

def create_processed_folder():
    """Create the processed folder if it doesn't exist."""
    processed_dir = Path(__file__).parent.parent / "data" / "processed"
    processed_dir.mkdir(exist_ok=True)
    return processed_dir

def remove_metadata_lines(lines):
    """
    Removes lines starting with specific metadata emojis and headers.
    Preserves quiz result lines and relevant content.
    """
    cleaned_lines = []
    remove_prefixes = ('🖊', '🏆', '⏱', '🤓')
    
    for line in lines:
        stripped = line.strip()
        
        # Debug: print first few lines
        if len(cleaned_lines) < 5:
            print(f"DEBUG: line='{stripped}' [len={len(stripped)}]")
        
        # Skip metadata lines
        if stripped.startswith(remove_prefixes):
            continue
        # Skip empty chapter headers like "ምዕራፍ 1 እና 2" and similar patterns
        # Check for the exact Ethiopian characters
        if 'ምዕራፍ' in stripped:
            continue
        # Skip quiz title lines that contain "Top results in the quiz"
        if 'Top results in the quiz' in stripped:
            continue
        # Skip lines starting with "Yonas Aye"
        if 'Yonas Aye' in stripped:
            print(f"DEBUG: Skipping Yonas line: '{stripped}'")
            continue
        # Skip completely empty lines
        if not stripped:
            continue
        # Keep everything else (quiz results, etc.)
        cleaned_lines.append(line)
    
    return cleaned_lines

def get_line_type(text):
    """Classify line type for formatting purposes."""
    if not text.strip():
        return 'EMPTY'
    if text.strip().startswith('🥇'):
        return 'GOLD'
    if re.match(r'^\s*\d+\.', text):
        return 'NUMBER'
    return 'OTHER'

def add_formatting_spaces(lines):
    """
    Manages spacing between lines:
    1. Between a Numbered line and a Gold (🥇) line: Force 2 empty lines.
    2. Between consecutive numbered lines: Remove empty lines to keep list contiguous.
    3. Otherwise: Preserve single empty lines or content.
    """
    final_lines = []
    last_type = None
    
    for line in lines:
        line_type = get_line_type(line)
        
        # Determine spacing based on transition from last_type to current line_type
        if last_type == 'NUMBER' and line_type == 'GOLD':
            # Transition from Number to New Quiz (Gold) -> 2 empty lines
            final_lines.append('\n')
            final_lines.append('\n')
        elif last_type == 'NUMBER' and line_type == 'NUMBER':
            # Transition from Number to Number -> No empty lines (contiguous)
            pass
        elif last_type is not None:
            # Default behavior for other transitions
            pass

        # Append the line itself
        final_lines.append(line)
        last_type = line_type
    
    return final_lines

def validate_quiz_results(lines):
    """
    Validate that quiz result lines are properly formatted.
    Returns statistics about the cleaning process.
    """
    result_pattern = re.compile(r'^\s*(?:🥇|🥈|🥉|\d+\.)\s*(@\S+|[^\u2013\n]+)\s*\u2013\s*(\d+)\s*\((.*?)\)')
    valid_results = []
    invalid_lines = []
    
    for line_num, line in enumerate(lines, 1):
        if line.strip() and get_line_type(line) in ['GOLD', 'NUMBER']:
            if result_pattern.match(line):
                valid_results.append(line_num)
            else:
                invalid_lines.append((line_num, line.strip()))
    
    return {
        'total_lines': len(lines),
        'valid_results': len(valid_results),
        'invalid_lines': invalid_lines
    }

def clean_quiz_data_optimized(file_path, output_filename=None):
    """
    Optimized data cleaning that preserves all relevant quiz data.
    """
    # Check if file exists
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return None

    # Create processed folder
    processed_dir = create_processed_folder()
    
    # Determine output filename
    if output_filename is None:
        input_name = Path(file_path).stem
        output_filename = f"{input_name}_cleaned.txt"
    
    output_path = processed_dir / output_filename
    
    # Create a backup of original file
    backup_path = file_path + ".bak"
    shutil.copy2(file_path, backup_path)
    print(f"Backup created at {backup_path}")

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        print(f"Original file: {len(lines)} lines")

        # Step 1: Remove unwanted metadata
        cleaned_lines = remove_metadata_lines(lines)
        print(f"After metadata removal: {len(cleaned_lines)} lines")
        
        # Step 2: Apply formatting rules
        final_lines = add_formatting_spaces(cleaned_lines)
        print(f"After formatting: {len(final_lines)} lines")
        
        # Step 3: Validate results
        stats = validate_quiz_results(final_lines)
        print(f"Valid quiz results: {stats['valid_results']}")
        if stats['invalid_lines']:
            print(f"Warning: {len(stats['invalid_lines'])} potentially invalid lines:")
            for line_num, line in stats['invalid_lines'][:5]:  # Show first 5
                print(f"  Line {line_num}: {line}")
        
        # Write cleaned data to processed folder
        with open(output_path, 'w', encoding='utf-8') as f:
            f.writelines(final_lines)
        
        print(f"Successfully cleaned and saved to: {output_path}")
        return str(output_path)

    except Exception as e:
        print(f"An error occurred: {e}")
        # Restore from backup if something went wrong
        if os.path.exists(backup_path):
            shutil.copy2(backup_path, file_path)
            print("Restored original file from backup due to error.")
        return None

if __name__ == "__main__":
    # Default to the raw file mentioned
    script_dir = os.path.dirname(os.path.abspath(__file__))
    default_file = os.path.join(script_dir, '..', 'data', 'raw', 'MatMarkLuke.txt')
    
    # Allow overriding via command line argument
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = default_file

    print(f"Processing file: {file_path}")
    result = clean_quiz_data_optimized(file_path)
    
    if result:
        print(f"\nCleaning completed successfully!")
        print(f"Processed file saved at: {result}")
    else:
        print("\nCleaning failed!")
