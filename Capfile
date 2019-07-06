# default deploy_config_path is 'config/deploy.rb'
set :deploy_config_path, 'config/deploy/config.rb'
# default stage_config_path is 'config/deploy'
set :stage_config_path, 'config/deploy/stages'

# Load DSL and set up stages
require "capistrano/setup"

# Include default deployment tasks
require "capistrano/deploy"

require "capistrano/scm/git"
install_plugin Capistrano::SCM::Git

# Load custom tasks from `deploy/tasks` if you have any defined
Dir.glob("deploy/tasks/*.rake").each { |r| import r }
