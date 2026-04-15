import csv

# We define the input file and the output file names
input_file = 'floods.csv'
output_file = 'sweden_floods.csv'

print(f"Reading {input_file}...")

# Open the input file for reading and the output file for writing
with open(input_file, mode='r', encoding='utf-8') as infile:
    # DictReader turns each row into a dictionary (key: value pairs)
    reader = csv.DictReader(infile)
    
    # Get the header names from the original file
    fieldnames = reader.fieldnames
    
    with open(output_file, mode='w', encoding='utf-8', newline='') as outfile:
        # DictWriter helps us write dictionaries back into CSV format
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        
        # Write the header (column names) first
        writer.writeheader()
        
        count = 0
        # Loop through every row in the original file
        for row in reader:
            # Check if the 'Country' matches 'Sweden'
            if row['Country'] == 'Sweden':
                writer.writerow(row)
                count += 1

print(f"Done! Saved {count} rows to {output_file}.")
