import os

base = '/home/z/my-project/src/app/(workspace)/memory'

test_names = [
    chr(91) + 'packId' + chr(93),
    chr(91) + 'id' + chr(93),
]

for name in test_names:
    try:
        target = os.path.join(base, name)
        os.mkdir(target)
        actual = [e for e in os.listdir(base) if os.path.isdir(os.path.join(base, e)) and e not in []]
        print(f'Asked: {repr(name)} Dirs: {repr(actual)}')
    except Exception as ex:
        print(f'Error for {repr(name)}: {ex}')
    # cleanup dirs that are not files
    for e in list(os.listdir(base)):
        fpath = os.path.join(base, e)
        if os.path.isdir(fpath):
            try:
                os.rmdir(fpath)
            except:
                pass
