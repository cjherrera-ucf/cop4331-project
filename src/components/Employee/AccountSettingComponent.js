import React from "react";
import { AccountSettingCard, AccountSettingH2 } from "./EmployeeElements";

const AccountSettingComponent = (props) => {
  const hideText = (text) => {
    /* turn text into asterisk */
  };

  return (
    <AccountSettingCard>
      {/* <AccountSettingIcon src={Icon1} /> */}
      <AccountSettingH2>{props.settingTitle}</AccountSettingH2>
      <AccountSettingH2>
        {/* {props.hidden ? hideText(props.value) : value} */}
      </AccountSettingH2>
    </AccountSettingCard>
  );
};

export default AccountSettingComponent;
