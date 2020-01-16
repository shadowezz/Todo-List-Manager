class Api::V1::TodoItemsController < ApplicationController
  
  before_action :set_todo_item, only: [:destroy, :update]
  
  def index
    @todo_items = TodoItem.where(user: current_user).where(current_status: nil).order(deadline: :ASC)
    render json: @todo_items
  end

  def create
    @todo_item = TodoItem.new(todo_item_params)
    @todo_item.user = current_user
    if @todo_item.save
      render json: {
        status: :created,
        todo: @todo_item
      }
    else 
      render json: {
        errors: @todo_item.errors.full_messages
      }
    end
  end

  def update
    if @todo_item.update(todo_item_params)
      render json: {
        status: :updated,
        todo: @todo_items
      }
    else
      render json: {
        status: :unprocessable_entity,
        errors: @todo_item.errors
      }
    end
  end

  def destroy
    @todo_item.destroy
    render json: {message: "Todo Item deleted successfully."}
  end

  private

  def todo_item_params
    params.require(:todo).permit(:title, :description, :category, :deadline, :status)
  end

  def set_todo_item
    @todo_item = TodoItem.find(params[:id])
  end
end
