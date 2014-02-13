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
      $redis.publish('messages.create', @message.to_json)
    else
      render json: {errors: @message.errors.messages}, status: :unprocessable_entity
    end
  end

  def events
    response.headers["Content-Type"] = "text/event-stream"
    redis = Redis.new
    redis.subscribe('messages.create') do |on|
      on.message do |event, data|
        response.stream.write("data: #{data}\n\n")
      end
    end
  rescue IOError
    logger.info "Stream closed"
  ensure
    redis.quit
    response.stream.close
  end
end
