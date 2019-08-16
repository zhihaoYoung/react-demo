import { JSEncrypt } from 'jsencrypt'
//公钥
    const PUBLIC_KEY = 
        `-----BEGIN PUBLIC KEY----- 
        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCUOgHJ1qrm0zdTne3Dh9EmXM0KJea
        5tXzndZLXzzbvI1B+L+06QK2yvu31pPWFc79rrCElY8VXTtR+DDW/+4rhUhwqXY6Vx22eO
        mPkFb6COcHm0hqSOW/EfnVN+u66abvCT8zBfSJu+3dtfWwMuSlyTlzyHW+7gT4IDdCn6WWFfQIDAQAB
        -----END PUBLIC KEY-----`
     //私钥
    const PRIVATE_KEY = 
        `-----BEGIN RSA PRIVATE KEY-----
        MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAJQ6AcnWqubTN1
        Od7cOH0SZczQol5rm1fOd1ktfPNu8jUH4v7TpArbK+7fWk9YVzv2usISVjxVdO1H4MNb/7iuFSHCpdjpXH
        bZ46Y+QVvoI5webSGpI5b8R+dU367rppu8JPzMF9Im77d219bAy5KXJOXPIdb7uBPggN0KfpZYV9AgMBAAECgYAbj7WpbCsX
        BIszFxiQ1P5E3diaXHXMbjytZSVKz5LtYGmlLRA1VrV1mR7yIBwvFlivkrAPHcAh/dxxG6Aa9JDcEDEE+p/vGI+QlWCaHbAu+LsMB91SU/kTN
        AfjUp9+4SQg1n1RpF+xKnqrsfKNsw86ruuLfmEyb6xrSCnRZ1kN2QJBAM6dAfMXZ2awjQOrjzs+Ja4iPRDo5pdMIbDnkBojLgLIZFBa0pehlkSQpVwWqz
        ICPt3CyVhVR/sLcnwXAFIyAOcCQQC3qDlwieJHDaD4gyaL4l6ggUUbyvsOrXa/Xx5AMeiSFE7GeAXNJfoSNFas8hBcvXQZNI6or7cGU6FdA8dp8OX7
        AkBKZt+82kCyCgG9wJnji42mF05GOJhRA2leewS5ZNG8zszQ4uPTFq02I6BoeQFNEOHymaJH3O3+yTCA3weOkdMhAkEAriVeqd6k6Fj8/QhnQZcZwToyj
        KMRIh7LjbUk2xw3+mQ1Oi5O2fMbx61HTuCNMVMXxlq2ty8+7knYpXlS2prphwJAUg34fRqpnaCAvJTue0JS2IPU+rqD/Xft0IzpSqpDCmaody5uKh65KpC7p
        6MSJzDnubFrDfJMbSkpPrggm2imIg==
        -----END RSA PRIVATE KEY-----`
     //使用公钥加密
    //  const encryptData = function(val){
    //     var encrypt = new JSEncrypt()
    //     encrypt.setPublicKey(PUBLIC_KEY)
    //     var encrypted = encrypt.encrypt(val)
    //     return encrypted
    //  }
    //  var encrypt = new JSEncrypt();
    //   // encrypt.setPublicKey('-----BEGIN PUBLIC KEY-----' + PUBLIC_KEY + '-----END PUBLIC KEY-----');
    //   encrypt.setPublicKey(PUBLIC_KEY);
    //   var encrypted = encrypt.encrypt('321');
    //   console.log('加密后数据:%o', encrypted);
    //   //使用私钥解密
    //   var decrypt = new JSEncrypt();
      // decrypt.setPrivateKey('-----BEGIN RSA PRIVATE KEY-----'+PRIVATE_KEY+'-----END RSA PRIVATE KEY-----');
    export function encryptData(data){
      var encrypt = new JSEncrypt()
          encrypt.setPublicKey(PUBLIC_KEY)
          encrypt.setPrivateKey(PRIVATE_KEY);
          let postData = {}
      if(data.constructor === Object){
        Object.keys(data).map((val,index)=>{
          if (val !== 'securityCode' || val !== 'accountOptionId' || val !== 'shortNumber'){
            postData[val]=encrypt.encrypt(data[val])
          }
          postData['securityCode'] = data['securityCode']
          postData['accountOptionId'] = data['accountOptionId']
          postData['shortNumber'] = data['shortNumber']
        })
      }else{
        postData = encrypt.encrypt(data)
      }
     setTimeout(() => {
      Object.keys(data).map((val,index)=>{
        var uncrypted = encrypt.decrypt(postData[val]);
        // console.log('解密后数据:%o',val,'==', uncrypted);
      })
     }, 2000);
      return postData
     
    }
