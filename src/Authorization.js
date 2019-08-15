import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import IconButton from '@material-ui/core/IconButton';
import ContactSupport from '@material-ui/icons/ContactSupport';
import Tooltip from '@material-ui/core/Tooltip';

export default class Authorization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: null

        };
    }



    vkAuth = () => {
        var vk = {
            data: {},
            api: "//vk.com/js/api/openapi.js",
            appID: 7070823,
            appPermissions: 8192+4
        };


        window.VK.Auth.login(authInfo => {
            if(authInfo.status === "connected"){
                this.state.userid = authInfo.session.user.id;
                alert('Вы успешно авторизовались');
                this.props.history.push('/wallpost');
            } else if (authInfo.status === "not_authorized"){
                alert('Разрешите права доступа приложению');
            }
        }, vk.appPermissions);

    }


    componentDidMount() {

        window.VK.init({apiId: 7070823});
        window.VK.Auth.getLoginStatus(
            loginInfo => {
                if(loginInfo.status === "connected"){

                   this.state.userid = loginInfo.session.mid;
                   this.props.history.push('/wallpost');
                }
            });
    }

    render() {

        return (

            <Container maxWidth="sm">
                <AppBar  position="sticky" color="default">
                    <Toolbar>
                        <Typography variant="h6" color="inherit">
                            Тестовый проект
                        </Typography>
                        <div  className="logoutButton">
                            <Tooltip title="чисто кнопочка">

                                <IconButton color="default"  aria-label="Add an alarm">
                                    <ContactSupport />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Toolbar>
                </AppBar>
                <div className="authorizationWindow">
                    <div className="authorizationText">
                        <Typography variant="h5" gutterBottom>
                            Авторизация
                        </Typography>
                    </div>
                    <div className="AuthButton">

                        <Button variant="contained"  color="primary" onClick={this.vkAuth}>
                            Войти через VK
                        </Button>
                    </div>
                </div>
            </Container>
        )
    }
}

