import {FilterValuesType} from "./App";
import React, {memo, useCallback} from "react";
import {Button, ButtonProps} from "@mui/material";

export type MyButtonPropsType = {

} & ButtonProps
export const MyButton = memo(({variant, onClick, color, title}: MyButtonPropsType) => {

    return <Button variant={variant}
                     onClick={onClick}
                     color={color}
    >
        {title}
    </Button>
})