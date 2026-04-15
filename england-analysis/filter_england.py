import csv
import os

# 1. We define where the original file is and where to save the new one.
# Notice I'm looking back one folder to find the original floods.csv.
input_file = '../floods.csv'
output_file = 'england_floods.csv'

print(f"Opening {input_file} to find England's flood data...")

# 2. Check if the original file exists before starting
if not os.path.exists(input_file):
    print(f"Error: Could not find {input_file}. Make sure you are in the england-analysis folder.")
else:
    # 3. Open the original file to read and the new file to write
    with open(input_file, mode='r', encoding='utf-8') as infile:
        # DictReader lets us refer to columns by their names (like 'Country')
        reader = csv.DictReader(infile)
        
        # Get the names of all the columns (Header)
        fieldnames = reader.fieldnames
        
        with open(output_file, mode='w', encoding='utf-8', newline='') as outfile:
            # DictWriter helps us save the data back into the CSV format
            writer = csv.DictWriter(outfile, fieldnames=fieldnames)
            
            # Write the column names at the top of the new file
            writer.writeheader()
            
            count = 0
            # 4. Loop through every row in the big file
            for row in reader:
                # 5. Check if the 'Country' is exactly 'England'
                if row['Country'] == 'England':
                    writer.writerow(row)
                    count += 1

    print(f"Successfully finished! Created '{output_file}' with {count} rows.")
