const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  accessKeyId: 'AKIAJMHDUCEW2SQHAEJA',
  secretAccessKey: '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',
  region: 'ap-south-1',
});

const SignedUrlHelper = {
  getAvatarSignedURL: (item) => {
    const avatar = item.hostedBy.avatar;
    const username = item.hostedBy.username;

    const params = {
      Bucket: 'senbi',
      Key: `images/${username}/photos/${avatar}.jpg`,
    };

    return new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (err, url) => {
        err ? reject(err) : resolve(url);
      });
    });
  },

  getPhotoSignedURL: (item) => {
    const image_name = item.image_name;
    const username = item.hostedBy.username;

    const params = {
      Bucket: 'senbi',
      Key: `images/${username}/${image_name}.jpg`,
    };

    return new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (err, url) => {
        err ? reject(err) : resolve(url);
      });
    });
  }

}

export default SignedUrlHelper;