/** @type {import('next').nextConfig} */

const nextConfig = {
    images:{
        remotePatterns:[
            {
                hostname: 'utfs.io'
            }

        ]
    }
};
module.exports = nextConfig
