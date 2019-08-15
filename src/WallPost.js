import React, {Component} from 'react' ;
import Button from "@material-ui/core/Button";
import Webcam from "react-webcam";
import Typography from "@material-ui/core/Typography";
import Container from '@material-ui/core/Container';
import download from 'download/download.js'
import Input from '@material-ui/core/Input';
import axios from 'axios';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
export default class WallPost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userid: null,
            webcamImage: null,
            postText: null,
            picture: null
        };
    }
    async componentDidMount() {
        await window.VK.init({apiId: 7070823});
        await window.VK.Auth.getLoginStatus(
            authInfo =>  {
                if(authInfo.status === "unknown" || authInfo.status === "not_authorized" ){
                    this.props.history.push('/');
                } else {
                    this.state.userid = authInfo.session.mid;
                    console.log("ид пользователя", this.state.userid);
                }
            }
        );
    }

    logoutVK = () =>{
        window.VK.Auth.logout(logoutInfo => {
            console.log("response", logoutInfo.status);
            if(logoutInfo.status === "unknown") {
                this.props.history.push('/');
            }
        });
    }


    uploadFile = async (e) => {
        let files = e.target.files;
        console.warn("data file", files);
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload= async (e)=>{
            this.state.picture = files[0];
            console.log(this.state.picture);
        }
    }

    setRef = webcam => {
        this.webcam = webcam;
    };


    createPost = async () => {
        let picture = this.state.picture;

        let postText = "";
        if(this.state.postText){
            postText = this.state.postText;
        }


        if(this.state.picture) {
            let url = null;
            let userid = this.state.userid;

            await window.VK.Api.call('photos.getWallUploadServer', {
                    v: "5.73"
                },
                async function (data) {

                    if (data.response) {
                        url = data.response.upload_url;
                        let photoq = picture;
                        let body = new FormData();
                        body.append('photo', photoq);

                        let responseFromServer = await axios({
                            method: 'post',
                            url: 'https://cors-anywhere.herokuapp.com/' + url,
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'otherHeader': 'foo',
                            },
                            data: body
                        });

                        await window.VK.Api.call('photos.saveWallPhoto', {
                                user_ids: userid,
                                photo: responseFromServer.data.photo,
                                server: responseFromServer.data.server,
                                hash: responseFromServer.data.hash,
                                v: "5.73"
                            },
                            async function (r) {
                                if (r.response) {

                                    console.log(r.response[0]);
                                    await window.VK.Api.call('wall.post', {
                                        owner_id: userid,
                                        v: "5.73",
                                        message: postText,
                                        attachments: 'photo' + r.response[0].owner_id + '_' + r.response[0].id,

                                    }, function (r) {
                                        if (r.response) {
                                            console.log(r);
                                            alert('Успешно опубликовано');
                                        }
                                    });
                                }
                            });
                    }
                });
        }
    }


    capture = async () => {

        const imageSrc = this.webcam.getScreenshot();
        this.state.webcamImage = imageSrc;
        let ImageURL = this.state.webcamImage;
        download(ImageURL, "pic.jpeg", "image/jpeg");
    };


    handleChange(e){
        this.setState({[e.target.id]: e.target.value});
        this.state.postText = e.target.value;
    }

    render() {
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: "user"
        };


        return(
            <Container maxWidth="md">
                <AppBar  position="sticky" color="default">
                    <Toolbar>
                        <Typography variant="h6" color="inherit">
                            Загрузка
                        </Typography>
                        <div  className="logoutButton">


                            <Button  variant="contained" color="default" onClick={this.logoutVK}>  Выход  <ExitToApp /> </Button>
                        </div>
                    </Toolbar>


                </AppBar>

                <Typography component="div" className="wallPostWindow">

                    <Grid container className="WallPostGrid" spacing={1}>
                        <Grid item md={12}>
                            <Grid container justify="center" spacing={4}>
                                <Grid key={1} item>
                                    <Paper>
                                        <div className="uploader">

                                            <Typography variant="h5" gutterBottom>
                                                Выбрать фото для загрузки
                                            </Typography>
                                            <Input type="file" name="file" className="btn-primary" multiple={false} onChange={(e)=>this.uploadFile(e)}/>
                                        </div>
                                    </Paper>
                                </Grid>

                                <Grid key={2} item>
                                    <Paper>
                                        <div className="takePhotoBlock">
                                            <Typography variant="h5" gutterBottom>
                                                Или сделать фото с веб-камеры
                                            </Typography>
                                            <div className="cameraBlock">
                                                <Webcam
                                                    audio={false}
                                                    height={240}
                                                    ref={this.setRef}
                                                    screenshotFormat="image/jpeg"
                                                    width={350}
                                                    minScreenshotWidth={1920}
                                                    minScreenshotHeight={1080}
                                                    videoConstraints={videoConstraints}

                                                />
                                            </div>

                                            <Button variant="contained" onClick={this.capture}>
                                                Сделать фото
                                            </Button>
                                        </div>
                                    </Paper>
                                </Grid>

                            </Grid>


                        </Grid>
                        <div className="textBlock">
                            <TextField
                                id=""
                                label="Текст"
                                className="postTextField"
                                type="text"
                                name="postTextField"
                                fullWidth="true"
                                margin="normal"
                                variant="outlined"
                                multiline
                                rowsMax="4"
                                onChange={this.handleChange.bind(this)}
                            />
                        </div>
                    </Grid>

                    <div className="buttonPost">
                        <Button  variant="contained" color="primary" onClick={()=>this.createPost()}>Отправить пост</Button>
                    </div>

                </Typography>
            </Container>


        )
    }

}