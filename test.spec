# -*- mode: python -*-

block_cipher = pyi_crypto.PyiBlockCipher(key='test')


a = Analysis(['manage.py'],
             pathex=['G:\\Project\\Test'],
             binaries=[],
             datas=[],
             hiddenimports=['timed_auth_token.authentication', 'server.page'],
             hookspath=['pyinstaller_hooks'],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          [],
          name='test',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          runtime_tmpdir=None,
          console=True )
