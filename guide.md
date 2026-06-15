# Mac 配置前端开发环境

## 第一步

安装 Xcode
xcode-select --install
Xcode Command Line Developer Tools

## 第二步

安装 HomeBrew
https://brew.sh/
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
添加环境变量
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> /Users/yijiang/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

## 第三步

安装 nvm
https://github.com/nvm-sh/nvm

touch ~/.zshrc 然后执行 curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
会自动添加环境变量到文件

## 第四步

安装 git 并配置 ssh
在第一步会自动安装 git
git config --global user.name "yjla"
git config --global user.email "308203203@qq.com"

生成 ssh 密钥
https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

添加 ssh
https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account
cd ~/.ssh
cat id_ed25519.pub


配置多个 ssh key
ssh-keygen -t ed25519 -C "yijianglu@trip.com" -f ~/.ssh/gitlab_id_ed25519 

~/.ssh/config
Host github.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_ed25519
Host git.dev.sh.ctripcorp.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/gitlab_id_ed25519

# 配置 React Native 开发环境

## 第一步
安装 watchman
brew install watchman

## 第二步
初始化项目
npx react-native@latest init AwesomeProject
