import os, shutil

base = '/home/z/my-project/src/app/(workspace)/memory'

# Remove any bad directories
for e in list(os.listdir(base)):
    f = os.path.join(base, e)
    if os.path.isdir(f) and 'Id]' in e:
        shutil.rmtree(f)
        print(f'Removed: {repr(e)}')

# Construct path with bracket using chr() to avoid any preprocessing
target = os.path.join(base, chr(91) + 'memId' + chr(93))
os.mkdir(target)
print(f'Created directory')

# Verify
for e in os.listdir(base):
    f = os.path.join(base, e)
    if os.path.isdir(f):
        print(f'Dir: {repr(e)} bytes: {e.encode()!r}')
