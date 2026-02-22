# list files only
dir "d:\final-project1\final year project" /s /b

# chain commands with semicolon
dir "d:\final-project1\final year project" /s /b; code "d:\final-project1\final year project"

# or use & as the call operator (must have a space before & )
dir "d:\final-project1\final year project" /s /b
& "D:\some\other\script-or-exe.ps1"