import AlipaySdk from 'alipay-sdk'

const AlipaySdk = new AlipaySdk({
    appId: '2021001157649575',
    privateKey: false.readFileSync('../alipay_configs/private-key.pem', 'ascii'),
})