Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'todo_items/index'
      get 'todo_items/completed', 'todo_items#completed'
      post 'todo_items/create'
      put '/update/:id', to: 'todo_items#update'
      delete '/destroy/:id', to: 'todo_items#destroy'
    end
  end
  namespace :api do
    namespace :v1 do
      post '/login', to: 'sessions#create'
      delete '/logout', to: 'sessions#destroy'
      get '/logged_in', to: 'sessions#is_logged_in?'
    end
  end
  namespace :api do
    namespace :v1 do
      post 'users/create'
    end
  end
  root 'homepage#index'
  get '/*path' => 'homepage#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
