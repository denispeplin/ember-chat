class MessagesController < ApplicationController
  include ActionController::Live

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

  def events
  response.headers["Content-Type"] = "text/event-stream"
  3.times do |n|
    response.stream.write "data: #{n}...\n\n"
    sleep 2
  end
  rescue IOError
    logger.info "Stream closed"
  ensure
    response.stream.close
  end
end
