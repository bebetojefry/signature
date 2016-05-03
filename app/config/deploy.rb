set :application, "signature app"
set :domain,      "ubuntu.dev"
set :user,        "vagrant"
set :deploy_to,   "/vagrant"
set :app_path,    "app"

set :repository,  "https://github.com/bebetojefry/signature.git"
set :scm,         :git
set :deploy_via,  :remote_cache

set :copy_vendors,  true
set :model_manager, "doctrine"
set :dump_assetic_assets, true

role :web,        domain                         # Your HTTP server, Apache/etc
role :app,        domain, :primary => true       # This may be the same as your `Web` server

set :shared_files,      ["app/config/parameters.yml"]
set :shared_children,     [app_path + "/logs", "vendor", "web/assets/vendor"]

set :writable_dirs,       ["app/cache", "app/logs"]
set :webserver_user,      "www-data"
set :permission_method,   :acl
set :use_set_permissions, true

set   :use_sudo,      true

before 'symfony:assetic:dump', 'node:download'
after 'node:download', 'bower:download'
after 'bower:download', 'bower:install'
after 'symfony:assetic:dump', 'symfony:permission'

namespace :node do
    desc 'Node download'
    task :download do
      capifony_pretty_print "--> Download NodeJS"
      invoke_command "sh -c 'curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash - && sudo apt-get install -y nodejs'"
      capifony_puts_ok
    end
end

namespace :bower do
    desc 'Run bower'
    task :download do
      capifony_pretty_print "--> Downloading Bower"
      invoke_command "sh -c 'sudo npm install -g bower'"
      capifony_puts_ok
    end
    task :install do
      capifony_pretty_print "--> Installing Bower dependencies"
      invoke_command "sh -c 'cd #{latest_release} && bower install'"
      capifony_puts_ok
    end
end

namespace :symfony do
    desc 'Setting permissions'
    task :permission do
      capifony_pretty_print "--> Setting permissions"
      invoke_command "sh -c 'chmod -R 777 #{latest_release}/app/cache && chmod -R 777 #{latest_release}/app/logs'"
      capifony_puts_ok
    end
end

set  :keep_releases,  3
