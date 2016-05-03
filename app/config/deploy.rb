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

set   :use_sudo,      false

before 'symfony:assetic:dump', 'bower:install'
after 'symfony:assetic:dump', 'symfony:permission'

namespace :bower do
    desc 'Run bower install'
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
      invoke_command "sh -c 'chmod -R 777 #{latest_release}/app/cache'"
      capifony_puts_ok
    end
end

set  :keep_releases,  3
