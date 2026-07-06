export async function healthRoutes(app: any) {

    app.get("/health", async () => {

        return {

            status:"ok",

            service:"Athena API"

        }

    })

}