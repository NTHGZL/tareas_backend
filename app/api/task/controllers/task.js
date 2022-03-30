'use strict';
const {parseMultipartData, sanitizeEnitity} = require('strapi-utils')
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx){
        let entity;
        if(ctx.is('multipart')){
            const {data, files} = parseMultipartData(ctx)

            data.user = ctx.state.user.id

            entity = await strapi.services.task.create(data, {files})

        }else{
            ctx.request.body.user = ctx.state.user.id
            entity = await strapi.services.task.create(ctx.request.body)
        }
        return entity
    },
    async find(ctx){
        if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
            try {
              const {id} = await strapi.plugins[
                'users-permissions'
              ].services.jwt.getToken(ctx);

              const result = await strapi.query('task').model.query(qb=>{
                  qb.where('user', id)
              }).fetchAll()

              return result

            }catch(err){
                return err.message
            }
        }
    }

    
};
