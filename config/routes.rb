ActionController::Routing::Routes.draw do |map|
  # The priority is based upon order of creation: first created -> highest priority.

  # Sample of regular route:
  #   map.connect 'products/:id', :controller => 'catalog', :action => 'view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   map.purchase 'products/:id/purchase', :controller => 'catalog', :action => 'purchase'
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   map.resources :products

  # Sample resource route with options:
  #   map.resources :products, :member => { :short => :get, :toggle => :post }, :collection => { :sold => :get }

  # Sample resource route with sub-resources:
  #   map.resources :products, :has_many => [ :comments, :sales ], :has_one => :seller
  
  # Sample resource route with more complex sub-resources
  #   map.resources :products do |products|
  #     products.resources :comments
  #     products.resources :sales, :collection => { :recent => :get }
  #   end

  # Sample resource route within a namespace:
  #   map.namespace :admin do |admin|
  #     # Directs /admin/products/* to Admin::ProductsController (app/controllers/admin/products_controller.rb)
  #     admin.resources :products
  #   end

  # You can have the root of your site routed with map.root -- just remember to delete public/index.html.
  # map.root :controller => "welcome"

  # See how all your routes lay out with "rake routes"

  # Install the default routes as the lowest priority.
  # Note: These default routes make all actions in every controller accessible via GET requests. You should
  # consider removing or commenting them out if you're using named routes and resources.
  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'
  
  map.connect '/', :controller => 'home', :action => 'index'
  map.root :controller => 'home'
  
  map.rates '/rates', :controller => 'home', :action => 'rates'
  map.mortgagerates '/mortgagerates', :controller => 'home', :action => 'mortgagerates'
  map.privacy '/privacy', :controller => 'home', :action => 'privacy'
  map.about '/about', :controller => 'home', :action => 'about'
  map.testimonials '/testimonials', :controller => 'home', :action => 'testimonials'
  map.services '/services', :controller => 'home', :action => 'services'
  map.links '/links', :controller => 'home', :action => 'links'
  map.join '/join', :controller => 'home', :action => 'join'
  map.patriotact '/patriotact', :controller => 'home', :action => 'patriotact'
  map.mortgages '/mortgages', :controller => 'home', :action => 'mortgages'
  map.hb_loginv3_1 '/hb_loginv3_1', :controller => 'home', :action => 'hb_loginv3_1'
  map.whatsnew '/whatsnew', :controller => 'home', :action => 'whatsnew'
  map.contact '/contact', :controller => 'home', :action => 'contact'
end
