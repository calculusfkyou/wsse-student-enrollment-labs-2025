1. API資源樹  
![411177034-api-resources.png](evidence/411177034-api-resources.png)  

2. Integration (GET /students -> Lambda)  
![411177034-api-integration-get-students.png](evidence/411177034-api-integration-get-students.png)  

3. Integration (POST /students -> Lambda)  
![411177034-api-integration-post-students.png](evidence/411177034-api-integration-post-students.png)

4. Integration (GET /health -> Lambda)  
![411177034-api-integration-health.png](evidence/411177034-api-integration-health.png)  

5. CORS(/students已啟用)  
![411177034-api-cors-students.png](evidence/411177034-api-cors-students.png)  

6. Stage=prod/Invoke URL  
![411177034-api-stage-prod.png](evidence/411177034-api-stage-prod.png)  

7. Authorizer設定 (Cognito)  
![411177034-auth-authorizer.png](evidence/411177034-auth-authorizer.png)  

8. Method Request Scopes (GET=students.read)  
![4111177034-auth-scope-get.png](evidence/4111177034-auth-scope-get.png)  

9. Method Request Scopes (POST=students.write)   
![411177034-auth-scope-post.png](evidence/411177034-auth-scope-post.png)

10. Lambda測試事件A (GET /health -> 200)  
![411177034-lambda-test-health.png](evidence/411177034-lambda-test-health.png)  

11. Lambda測試事件B (POST /students -> 201 + Location)  
![411177034-lambda-test-post.png](./evidence/411177034-lambda-test-post.png)  

12. CloudWatch Logs  
![411177034-logs.png](evidence/411177034-logs.png)  

12-1. 411177034-logs-1  
![411177034-logs-1.png](evidence/411177034-logs-1.png)  

12-2. 411177034-logs-2  
![411177034-logs-2.png](evidence/411177034-logs-2.png)  

12-3. 411177034-logs-3  
![411177034-logs-3.png](evidence/411177034-logs-3.png)
