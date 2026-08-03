import os, shutil

base = '/home/z/my-project/src/app/(workspace)/memory'

# Remove all directories that are not standard files
for e in list(os.listdir(base)):
    fpath = os.path.join(base, e)
    if os.path.isdir(fpath):
        shutil.rmtree(fpath)
        print(f'Removed: {repr(e)}')

# Create correct directory
try:
    target = os.path.join(base, chr(91) + 'packId' + chr(93))
    os.mkdir(target)
    print('Created [packId]')
except Exception as ex:
    print(f'Error: {ex}')

# Verify
for e in os.listdir(base):
    fpath = os.path.join(base, e)
    if os.path.isdir(fpath):
        print(f'Dir exists: {repr(e)}')