import * as React from "react";
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { AppointmentTooltip} from '@devexpress/dx-react-scheduler-material-ui';


export default function Content(props, button){

		return(
            <AppointmentTooltip.Content  {...props}  appointmentData={props.appointmentData}  >
                <Grid container alignItems="center">
                    <Grid sx={{ m: 2 }}>
                        <QuestionMarkIcon />
                    </Grid>
                    <Grid item xs={10}>
                        <p>Did the customer come ?
                            <IconButton color="success" >
                                <CheckIcon />
                            </IconButton>
                            <IconButton color="error"  >
                                <ClearIcon />
                            </IconButton>
                        </p>
                    </Grid>
                </Grid>
            </AppointmentTooltip.Content>
        )

}

