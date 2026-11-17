import json

def check_order():
    db = json.load(open('data/submarines_database.json', encoding='utf-8'))
    print(f"Total Submarines in Database: {len(db['submarines'])}")
    print(f"Total Physical Sheets: {db['metadata']['total_physical_sheets']}")
    print("-" * 80)
    for k, v in db['submarines'].items():
        dp = v['duplex_print']
        print(f"Page {dp['page_number']:02d} | Hoja {dp['sheet_number']} ({dp['side']:<17}) | {v['class_name']:<25} | Fam: {dp['family']}")
    print("-" * 80)

if __name__ == '__main__':
    check_order()
