# TODO
---
* create option to halt the workflow until external input calls next
  * this should create a temporary auth key that should be used in the request to move next
  * no next event will be emitted until the move next has been requested
* make sure the get all required input from nested workflows


# Notes
---
* workflow runs with nested workflows will populate the resumeSuccess/Fail/Exception fields
* a copy of each step parameter will be created in the workflow itself