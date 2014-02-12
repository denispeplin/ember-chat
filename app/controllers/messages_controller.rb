class MessagesController < ApplicationController
  def index
    @messages = Message.all
    render json: @messages
  end

  def create
    @message = Message.new params.require(:message).permit(:body)
    if @message.save
      render json: @message
    end
  end
end
