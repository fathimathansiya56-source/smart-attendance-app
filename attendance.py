import pandas as pd
from datetime import datetime

name = "Ansiya"

time_now = datetime.now().strftime("%d-%m-%Y %H:%M:%S")

data = {
    "Name": [name],
    "Time": [time_now]
}

df = pd.DataFrame(data)

df.to_csv("attendance.csv", mode="a", header=False, index=False)

print("Attendance Marked!")