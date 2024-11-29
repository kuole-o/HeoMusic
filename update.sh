#!/bin/bash

# 输出部署信息
echo -e "\033[0;32mDeploying updates to music.guole.fun...\033[0m"

# 判断操作系统类型
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  PROJECT_PATH="$HOME/文稿/src/music"
elif [[ "$OSTYPE" == "msys" ]]; then
  # Windows (Git Bash)
  PROJECT_PATH="d:/src/music"
else
  echo "Unsupported OS: $OSTYPE"
  exit 1
fi

# 切换到项目目录
cd "$PROJECT_PATH" || { echo "Failed to change directory to $PROJECT_PATH"; exit 1; }

# 添加所有更改
git add .

# 设置提交信息
msg="🏖️ Music更新于 $(date)"
if [ $# -eq 1 ]; then
  msg="$1"
fi

# 提交更改
git commit -m "$msg"

# 推送到 GitHub
git push github main:main

# 执行完成后，不自动退出
exec /bin/bash