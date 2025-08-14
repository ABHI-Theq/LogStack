import amqp from "amqplib"

let channel: amqp.Channel;

export const connectRabbitMQ=async()=>{
    try {
        const connection=await amqp.connect({
            protocol:"amqp",
            hostname:"localhost",
            port:5672,
            username:"admin",
            password:"admin123"
        })

         channel=await connection.createChannel()
        console.log("✅Connected to RabbitMq");
    } catch (error) {
        console.log("❌Failed to connect to RabbitMq",error);
    }
}

export const publishToQueue=async(queueName:string,message:any)=>{
    try {
        
        if(!channel){
            console.log("Rabbitmq channel is not intialized");
            return;
        }
        await channel.assertQueue(queueName,{durable:true})

        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)),{
            persistent:true
        })

    } catch (error) {
        console.log(error instanceof Error?error.message:"Failed to publish to queue");
    }
}

export const invalidateCacheJob=async(cacheKeys:string[])=>{
    try {
        
        const message={
            action:"invalidateCache",
            keys:cacheKeys
        }

        await publishToQueue("cache-invalidation",message)
        
        console.log("✅ Cachekeys published to queue for invalidation");

    } catch (error) {
        console.log("❌ AN error occurred while publishing cachekeys to queue",error);
    }
}