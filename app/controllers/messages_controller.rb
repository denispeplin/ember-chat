class MessagesController < ApplicationController
  def index
    @messages = Message.all
    render json: @messages
  end

  def create
    @message = Message.new params.require(:message).permit(:body)
    if @message.save
      render json: @message
    else
      render json: {errors: @message.errors.messages}, status: :unprocessable_entity
    end
  end
end
