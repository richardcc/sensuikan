with open('app/js/data.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx_start = text.find('const SUB_DB =')
idx_end = text.find('const IJN_COMMANDERS =', idx_start)
sub_db_str = text[idx_start + len('const SUB_DB ='):idx_end].strip()
print("Length of sub_db_str:", len(sub_db_str))
print("Last 150 chars:\n", repr(sub_db_str[-150:]))
