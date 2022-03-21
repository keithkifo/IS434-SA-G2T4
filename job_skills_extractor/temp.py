import numpy as np
import pandas as pd
import tabula as tb

# Dot product calculation
# skill_vector = np.array( [1, 1, 0, 0] )
# job_vector = np.array( [1, 1, 1, 1] )
# temp = np.dot(skill_vector, job_vector)
# print(temp / 4)

pdf = tb.read_pdf("./data_ai_scientist.pdf", pages='all')
