class AddStatusToTodoItems < ActiveRecord::Migration[6.0]
  def change
    add_column :todo_items, :current_status, :string
  end
end
