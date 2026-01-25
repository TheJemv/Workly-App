import Day from "./Day.types";
import DayName from "./DayName.types";

type DataDays = {
    [key in DayName]: Day;
};

export default DataDays;