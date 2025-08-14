import amqp from "amqplib";
import { redis } from "..";
import { sql } from "./DBConnect";

interface CacheInvalidationMessage {
  action: string;
  keys: string[];
}

export const startConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: "localhost",
      port: 5672,
      username: "admin",
      password: "admin123",
    });

    const queueName="cache-invalidation"
    const channel=await connection.createChannel()

    await channel.assertQueue(queueName,{durable:true})

    channel.consume(queueName,async(msg)=>{
        if(msg){
            try {
                const content=JSON.parse(msg.content.toString()) as CacheInvalidationMessage

                if(content.action==="invalidateCache"){
                    for (const pattern of content.keys){
                        const keys=await redis.keys(pattern)

                        if(keys.length>0){
                            await redis.del(...keys)
                            
                console.log(
                  `🗑️ Blog service invalidated ${keys.length} cache keys matching: ${pattern}`
                );

                const category = "";

                const searchQuery = "";

                const cacheKey = `blogs:${searchQuery}:${category}`;

                const blogs =
                  await sql`SELECT * FROM blogs ORDER BY create_at DESC`;

                await redis.set(cacheKey, JSON.stringify(blogs), {
                  ex: 3600,
                });

                console.log("🔄️ Cache rebuilt with key:", cacheKey);
                        }

                    }
                }
                channel.ack(msg)

            } catch (error) {
             console.error(
            "❌ Error processing cache invalidation in blog service:",
            error
          );

          channel.nack(msg, false, true); 
            }
        }
    })

  } catch (error) {
    console.error("❌ Failed to start rabbitmq consumer");
  }
};
