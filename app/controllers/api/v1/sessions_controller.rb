class Api::V1::SessionsController < ApplicationController
  /create new session if user authenticated/
  def create
    @user = User.find_by(email: session_params[:email])
  
    if @user && @user.authenticate(session_params[:password])
      login!
      render json: {
        logged_in: true,
        user: @user
      }
    else
      render json: { 
        status: 401,
        errors: 'Incorrect email or password. Please try again or sign up for a new account'
      }
    end
  end

  /check login status of user/
  def is_logged_in?
    if logged_in? && current_user
      render json: {
        logged_in: true,
        user: current_user
      }
    else
      render json: {
        logged_in: false,
        user: nil
      }
    end
  end

  /delete session (logout)/
  def destroy
    logout!
    render json: {
      status: 200,
      logged_out: true
    }
  end

  private

  /restrict session parameter that can be accessed/
  def session_params
    params.require(:user).permit(:username, :email, :password)
  end
  
end
