import React from 'react';
import { Colors } from '../lib';


const TabItem = ({ iconName, focusName, icon: IconComponent, focusIcon: FocusIconComponent, focused }) => {
   return (
      focused ? (
         <IconComponent
            name={iconName}
            size={26}
            color={focused ? Colors.principal[500] : "#858585"}
            className="font-bold"
         />
      ) : (
         <FocusIconComponent
            name={focusName}
            size={26}
            color={focused ? Colors.principal[500] : "#858585"}
            className="font-bold"
         />
      )
   );
};


export default TabItem;
