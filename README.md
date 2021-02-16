# ynab-otp-tools

A set of functions to help with maintaining YNAB (youneedabudget.com) with otpsrbija's ebanking.

It uses YNAB API together with copy of OTP's JSON response containing a list of transactions (i know, right?).

Sadly the integration doesn't exist, so for now this helps with data entry into YNAB by showing which transactions haven't been entered or which transactions have been cleared and are not marked as cleared in YNAB. 

The plan is to extend these scripts to update YNAB automatically, taking away all manual work of maintaining the budget.