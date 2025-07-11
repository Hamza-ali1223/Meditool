import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    appointments:
    [

    ]
}

const appointmentSlice=createSlice(
    {
        name:'appointment',
        initialState,
        reducers:
        {
            setAppointment: (state,action)=>{
                const data= [...state.appointments,action.payload]
                return {
                    ...state,
                    appointments:data
                }
            },
            setInitialAppointment: (state,action) => {
                state.appointments=action.payload
            },
             
            /**
         * Adds a single new appointment to the existing list.
         * Useful after the user creates a new appointment.
         */
        setAppointment: (state, action) => {
            state.appointments.push(action.payload);
        },
            resetAppointments: (state,action) =>
            {
                state.appointments=initialState.appointments;
            },
            updateAppointment: (state,action) =>
            {
                return {
                    ...state,
                    appointments:state.appointments.map((appointments)=>
                    {
                        if(appointments.id===action.payload?.id)
                        {
                            return action.payload
                        }
                        else
                        {
                            return appointments;
                        }
                    })
                }
            },
        }
    }
)

export const {setAppointment,resetAppointments,updateAppointment,setInitialAppointment}=appointmentSlice.actions;
export const appointmentReducer=appointmentSlice.reducer;