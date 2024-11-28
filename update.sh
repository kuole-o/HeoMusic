#!/bin/bash
echo -e "\033[0;32mDeploying updates to lizhi.guole.fun...\033[0m"

cd d:/src/music
git add .
msg="🏖️ lizhi更新于 `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

# Push source and build repos.
git push github lizhi:lizhi

#./deplay.bat

# push执行完成，不自动退出
exec /bin/bash