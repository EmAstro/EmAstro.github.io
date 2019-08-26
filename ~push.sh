NOW=$(date +"Date:%Y-%m-%d,Hour:%T")
git add --all
git commit -m "Last update: $"
git push -u origin master
