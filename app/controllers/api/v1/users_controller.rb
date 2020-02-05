class Api::V1::UsersController < ApplicationController
  
  / list of users /
  def index
    @users = User.all
    if @users
      render json: {
        users: @users
      }
    else
      render json: {
        status: 500,
        errors: ['no users found']
      }
    end
  end

  / create new user during sign up /
  def create
    @user = User.new(user_params)
    if @user.save
      render json: {
        status: :created,
        user: @user,
        message: "Account created successfully! Please log in to continue."
      }
    else 
      render json: {
        status: 500,
        errors: @user.errors.full_messages
      }
    end
  end

  private
  
  /restrict user parameter that can be accessed/
  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation)
  end
end
