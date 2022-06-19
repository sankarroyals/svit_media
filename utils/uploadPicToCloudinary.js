import axios from 'axios';

const uploadPic = async (media) => {
  try {
    const form = new FormData();
    form.append('file', media);
    form.append('upload_preset', 'Social_media');
    form.append('cloud_name', 'du3tfu1fb');
    const res = await axios.post(process.env.CLOUDINARY_URL, form)
    return res.data.url;
  }
  catch (err) {
    console.log(err);
  }

}
export default uploadPic;
