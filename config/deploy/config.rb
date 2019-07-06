# config valid only for current version of Capistrano
lock "3.11.0"

set :application, "perasconmanzanas"
set :repo_url, "git@github.com:chamini2/i.git"

# directory to deploy to in the target server
set :deploy_to, -> { "~/#{fetch :application}" }

append :linked_files, ".env", "db/sqitch.conf"
append :linked_dirs, "config/data"
