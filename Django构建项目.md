# 基于Django快速构建Web项目

```
本章主要记录怎么用Django快速构建一个web项目，所有的内容也是本人亲自构建，整个项目完美运行。
项目地址见：https://github.com/blacksider/django-startup
```

## 1. 环境准备

- 开发环境：

```
操作系统：Windows10 x64
python版本：3.7
VisualStudio版本：VS2017 Community
IDE: PyCharm 2017.1.2
```

## 2. 项目说明

```
项目搭建的方案选择前后端分离的构建方式，后端使用djangorestframework，前端使用Angular6
```

## 3. 搭建后台

- 准备依赖环境

```
pip3 install django
```

- 设置项目，执行 'django-admin startproject server .'，创建一个启动项目，执行后文件结构类似于：

```
...
server/
	__init__.py
	settings.py
	urls.py
	wsgi.py
manage.py
```

- 此命令为 django 内置的命令，可以帮助开发者快速构建一个启动项目；
- 注意命令行后面的 '.'，表示在当前目录下创建项目，否则会生成一个结构 'server/server/'；
- 现在可以直接启动项目，测试项目是否可以运行，执行 'python manage.py runserver'，可以看到控制台中弹出了如下的信息：

```
Performing system checks...

System check identified no issues (0 silenced).

You have 15 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
Run 'python manage.py migrate' to apply them.
October 15, 2018 - 11:08:12
Django version 2.1.1, using settings 'server.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

- 现在访问地址 'http://127.0.0.1:8000/' ，可以看到django的默认启动页面了。
- 但是可以看到控制台信息中有一行提醒 'You have 15 unapplied migration(s)'，这是因为 django 本身内嵌了很多关于用户和权限的数据结构，并且 django 默认使用的数据库为 sqlite3，所以它会尝试初始化相关的 Model ，根据提示，先删除掉刚才启动时创建的文件 db.sqlite3，执行 'python manage.py migrate'，可以看到重新生成了一个 db.sqlite3 文件，通过 PyCharm 的 Database 视图连接此文件，可以看到项目中创建如下表：

```
auth_group
auth_group_permissions
auth_permission
auth_user
auth_user_groups
auth_user_user_permissions
django_admin_log
django_content_type
django_migrations
django_session
sqlite_master
sqlite_sequence
```

- 这些即是 django 本身需要的数据库表了，再次执行 'python manage.py runserver'，可以看到提醒 migration 的信息消失。
- 现在，已经拥有一个可以运行的后端项目了，下面需要将数据库替换为其他数据库，这里使用 postgresql 作为此项目的数据库；
- 首先，删除掉刚才生成的 db.sqlite3 文件，然后打开文件 server/settings.py ，找到 DATABASES 配置项，这里默认的内容如下：

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
```

- 现在，需要将其替换为 postgresql 的配置，修改为：

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'testdb',
        'USER': 'testdbuser',
        'PASSWORD': 'test',
        'HOST': 'localhost',
        'PORT': '',
    }
}
```

- 在 postgresql 中创建对应的数据库和用户信息后，执行 migration 操作 'python manage.py migrate'，然后再启动项目，确定项目无异常。
- 现在我们可以创建一个默认的超级用户，使用如下的命令

```
python manage.py createsuperuser --email admin@test.com --username admin
```

- 这里我们创建一个用户名密码均为 admin 的用户，打开文件 server/urls.py，可以看到如下内容：

```
urlpatterns = [
    path('admin/', admin.site.urls),
]
```

- 此处的配置为 django 的一个内置的页面链接，可以自行查看一下该内容，该链接会打开一个默认的admin登录页面，可以用刚才创建的用户登录此系统，这里我不需要使用该链接地址，直接删除掉，后面需要使用的是基于 RESTAPI 的 djangorestframework 提供的url地址。
- 后面需要安装如下依赖：

```
pip3 install djangorestframework
pip3 install django-rest-auth
pip3 install djangorestframework-timed-auth-token
```

- djangorestframework的官方文档位于`https://www.django-rest-framework.org/tutorial/quickstart/`
- django-rest-auth 会整合 djangorestframework 提供一套基于 rest api 的登录退出以及重置密码等操作的 rest 服务；
- 前端和后端的登录验证会以 token 模式处理，但是默认提供的 token 机制没有超时时间，即无法做到如30分钟无操作认为登录失效的效果，这里还需要使用 djangorestframework-timed-auth-token 来实现；
- 在 server/settings.py 中在 INSTALLED_APPS 中添加如下内容：

```
INSTALLED_APPS = [
	...
    'rest_framework',
    'rest_framework.authtoken',
    'rest_auth',
    'timed_auth_token',
]

TIMED_AUTH_TOKEN = {
    'DEFAULT_VALIDITY_DURATION': timedelta(minutes=30)
}
```

- TIMED_AUTH_TOKEN 配置中的 DEFAULT_VALIDITY_DURATION 配置表示超时时间为30分钟；
- 修改 server/urls.py：

```
urlpatterns = [
    url(r'^api/', include(('timed_auth_token.urls', 'timed_auth_token'), namespace='auth'), name='login'),
    url(r'^api/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^api/user/$', UserDetailsView.as_view(), name='user_details'),
]

```

- 后面的内容不会涉及到用户的创建和删除问题，并且会添加相关请求权限，所以目前只会使用 timed_auth_token 的登录url，rest_auth 的退出url和查看当前用户信息的api；
- 执行 'python manage.py migrate'，更新数据库表，然后启动项目，访问 'http://localhost:8000/api/login/' ，可以看到提醒不支持 get 方法，并且下方会有一个默认的简单的登录表单，输入之前创建的用户信息后，可以看到返回信息为：

```
{
    "token": "wmX1HkBDIEIOwIYlXQ9JNVc5gXgSw3eH8V7-oYCw"
}
```

- 此内容即为后面需要用到的登录验证的 token；
- 查看数据库 timed_auth_token_timedauthtoken 表，可以看到一条超时时间为30分钟的记录。
- 现在，再添加一个测试模块，用来测试当登录成功后，可以查看此模块中的信息：
- 在 server 目录下添加目录 trees，执行 `python manage.py startapp trees ./server/trees/`，生成 trees 模块；
- 在添加新代码之前，先将 logger 模块添加到项目中，在 server/settings.py 中添加如下内容：

```
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '%(asctime)s [%(threadName)s:%(thread)d] [%(name)s:%(lineno)d] [%(module)s:%(funcName)s] [%(levelname)s]- %(message)s'
        }
    },
    'filters': {
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'log/server.log',
            'maxBytes': 1024 * 1024 * 5,
            'backupCount': 5,
            'formatter': 'standard',
        },
        'console': {
            'level': 'INFO',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
            'formatter': 'standard'
        },
        'error': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'log/error.log',
            'maxBytes': 1024 * 1024 * 5,
            'backupCount': 5,
            'formatter': 'standard',
        }
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'propagate': True,
        },
        'django.request': {
            'handlers': ['error'],
            'level': 'ERROR',
            'propagate': False,
        },
        'custom': {
            'handlers': ['console', 'error', 'file'],
            'level': 'INFO'
        }
    }
}
```

- 此配置表示会在控制台打印错误信息，并且会将信息同时输出到 log/server.log 文件中，error 级别的错误信息会输出到 log/error.log 文件中，由于 logger 模块不会自动创建 logs 目录，并且直接启动的时候它会报错，所以需要在 manage.py 中的开始位置检查目录是否存在，如果不存在创建该目录：

```
if __name__ == '__main__':
    if not os.path.exists('log'):
        os.makedirs('log')
    ...
```

- 在 server/settings.py 的 INSTALLED_APPS 中将 trees 模块添加进去

```
INSTALLED_APPS = [
	...
    'server.trees',
]
```

- 在 server/trees/models.py 中添加 Tree Model：

```
class Tree(models.Model):
    name = models.CharField(max_length=100, null=False)
    age = models.IntegerField(default=0)
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = '"test_tree"'
        ordering = ('-update_time',)
```

- Tree Model 包含四个字段，django 会自行创建的 id 字段，名称 name， 年龄 age，创建时间 create_time 以及此行数据最后的更新时间 update_time，create_time 中的 auto_now_add 表示此数据会在第一次创建时自动添加为当前时间，不需要人为设置时间，update_time 中的 auto_now 则表示每次更新数据都会更新为当前时间；
- Meta 中设置数据库表名称为 test_tree，并且默认查询排序以 update_time 降序（负号表示降序，升序的话只需要去掉字段名前的负号即可）；
- 同时，还需要为其创建一个 Serializer，供后面的 view 调用，在 server/tress 下创建 serializers.py 并添加：

```
class TreeSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(required=True, max_length=100)
    age = serializers.IntegerField(required=True, validators=[MinValueValidator(0)])
    create_time = serializers.DateTimeField(read_only=True)
    update_time = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return Tree.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.age = validated_data.get('age', instance.age)
        instance.save()
        return instance
```

- 定义 create 方法直接将请求内容（post体）中的数据转换为对应的字段，update 方法只更新传过来的 name 和 age。
- 最后，为 Tree 创建 view，在 server/trees/views.py 中添加增删改查：

```
logger = logging.getLogger('custom')

class TreeView(RetrieveAPIView):
    queryset = Tree.objects.all()
    serializer_class = TreeSerializer
    permission_classes = (IsAuthenticated,)

class TreeDestroyView(DestroyAPIView):
    queryset = Tree.objects.all()
    serializer_class = TreeSerializer
    permission_classes = (IsAuthenticated,)

class TreeListView(ListAPIView):
    serializer_class = TreeSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        Optionally restricts the returned trees by filtering against a `name` query parameter in the URL.
        """
        queryset = Tree.objects.all()
        name = self.request.query_params.get('name', None)
        if name is not None:
            queryset = queryset.filter(name=name)
        return queryset

class TreeCreateView(GenericAPIView):
    serializer_class = TreeSerializer
    permission_classes = (IsAuthenticated,)

    def save(self, request):
        try:
            tree = None
            _id = request.data.get('id')
            if _id:
                try:
                    tree = Tree.objects.get(id=request.data.get('id'))
                except Tree.DoesNotExist:
                    pass
            if not tree:
                serializer = self.get_serializer(data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                serializer = self.get_serializer(data=request.data)
                if serializer.is_valid():
                    serializer.update(tree, request.data)
                    return Response(serializer.data, status=status.HTTP_200_OK)
            raise exceptions.ValidationError('tree serializer not valid')
        except Exception as e:
            logger.error('save tree data error')
            logger.exception(e)
            return Response({"message": "unexpected error: %s" % str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        return self.save(request)
```

- permission_classes 全部设置为 IsAuthenticated，表示只有登录后才能使用这些 api；
- TreeListView 中设置一个参数 name，表示可以传递 name 参数来过滤名称包含此信息的内容；
- TreeCreateView 中的逻辑为当记录存在时更新信息，否则为新建信息；
- 当然你也可以将所有的操作方法写在一个 view 里面，这里的写法只代表个人风格；
- 在 server/urls.py 中添加对应的 url配置：

```
urlpatterns = {
	...
    url(r'^api/tree/(?P<pk>\d+)$', TreeView.as_view(), name='tree_detail'),
    url(r'^api/tree/(?P<pk>\d+)/del$', TreeDestroyView.as_view(), name='tree_delete'),
    url(r'^api/trees/$', TreeListView.as_view(), name='tree_list'),
    url(r'^api/tree/$', TreeCreateView.as_view(), name='tree_save'),
}
```

- 由于默认的分页请求时，请求中不能传递当前页面查询个数大小（可以查看类 PageNumberPagination，发现 page_size_query_param = None），需要自定义，所以需要添加一个自定义的分页类，只需要指定 page_size_query_param 即可，在 server 目录下添加文件 page.py，添加如下内容：

```
class DynamicPagination(PageNumberPagination):
    page_size_query_param = 'size'
```

- size 即为分页请求中控制查询个数控制的请求参数；
- 然后，在 server/settings.py 中，添加权限控制代码：

```
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'timed_auth_token.authentication.TimedAuthTokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_PAGINATION_CLASS': 'server.page.DynamicPagination'
}
```

- DEFAULT_AUTHENTICATION_CLASSES 表示使用基于超时的 TimedAuthTokenAuthentication 来做登录token验证， DEFAULT_PERMISSION_CLASSES 中设置默认请求都需要验证登录信息，DEFAULT_RENDERER_CLASSES 表示请求及返回数据以 json 格式为主，DEFAULT_PAGINATION_CLASS 指定默认分页类；
- 现在，执行 'python manage.py makemigrations trees'，创建 Model 对应的 migration 文件，再执行 'python manage.py migrate'，使其更新到数据库中。
- 启动项目，尝试访问 'http://localhost:8000/api/tree/' ，会发现后台返回了如下内容：

```
{"detail":"Authentication credentials were not provided."}
```

## 4. 搭建前端

- 现在，后台就全部架设完毕了，然后需要再为之创建一个基于Angular6的前端，关于怎么创建前端项目，此处不会详细描述，这里为了快速构建，使用 Angular 提供的 angular-cli 控件来创建前端项目；
- 安装 angular-cli，执行 'ng new client --style=less' 创建前端项目，并添加相关组件（登录，主页面，树列表页面等），具体内容请查看项目最终的内容；
- 访问 'localhost:4200' 登录后即可看到相关内容。

## 5. 编译项目

- 由于django对于前后端分离后挂在前端静态页面的处理并不好，这里我选择使用nginx代理的方式来处理前端后端的配置，nginx配置例如：

```
server {
    listen       8008;
    server_name  localhost;
    
    root /Test/client/dist/client;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ /index.html =404;
    }
    
    location ^~ /api {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_redirect off;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:8000;
    }
}
```

- root 为前端编译后的文件夹所在位置，通过 try_files 代理前端静态文件；
- /api 的反向代理将 /api 开头的请求转发到后端server中。
- 前端只需要通过 npm run build 编译即可；
- 后端通过 pyinstaller 编译项目；
- 后端编译前先安装如下依赖：

```
pip3 install psycopg2
pip3 install pypiwin32
pip3 install pycrypto
pip3 install pyinstaller
```
- pycrypto Windows10可能会无法安装（我就遇到了这种问题），本地在安装了VS2017 Community的前提下，出现无法安装的时候，开始菜单搜索 'VS 2017的 x64_x86交叉工具命令提示符'，以管理员身份运行，执行 `set CL=-FI"%VCINSTALLDIR%Tools\MSVC\14.14.26428\include\stdint.h"`， 14.14.26428 为我安装的这个版本的数字，需要检查具体的数字，直接取VS2017安装目录下查看此目录即可，然后再执行 `pip3 install pycrypto` 就能安装成功了。
- 依赖全部安装完毕后，执行如下命令：

```
pyi-makespec -F --name=test --key test manage.py
pyinstaller --clean test.spec
```

- -F 表示编译成一个单独的exe文件，--key 表示使用 test 加密exe文件，这里会用到 pycrypto 来做源文件加密，pycrypto会使用 AES 加密程序，能够一定程度的防止程序被破解；
- 编译成功后，执行 `./dist/test.exe runserver localhost:8000` 运行后端；
- 然后等一会后就会发现控制台出现了如下信息：

```
ModuleNotFoundError: No module named 'rest_framework.apps'
```

- 此处出错的原因是一些隐藏的导入，比如说 DynamicPagination 这个类，由于是在 server/settings.py 中的某个配置项中的字符串中，在动态解析的情况下，编译器可以找到这个类，但是在提前编译好的时候，pyinstaller并不会去解析这些内容，所以会出现很多某块找不到的情况，所以这里需要用一些特殊处理来解决这个问题，经过一段时间的研究后，对于一些单个文件无法找到的情况下，选择使用指定 --hidden-import 参数来解决，对于一些整个某块大部分内容都加载不正常的时候，选择使用 pyinstaller 提供的 hooks 文件的方式来解决，先创建文件夹pyinstaller_hooks，然后依次加入如下几个文件和内容：


- hook-rest_auth.py

```
from PyInstaller.utils.hooks import collect_submodules
hiddenimports = collect_submodules('rest_auth')
```

- hook-rest_framework.authtoken.py

```
from PyInstaller.utils.hooks import collect_submodules
hiddenimports = collect_submodules('rest_framework.authtoken')
```

- hook-rest_framework.py

```
from PyInstaller.utils.hooks import collect_submodules
hiddenimports = collect_submodules('rest_framework')
```

- hook-timed_auth_token.py

```
from PyInstaller.utils.hooks import collect_submodules
hiddenimports = collect_submodules('timed_auth_token')
```

- 最后执行如下命令编译：

```
pyi-makespec -F --additional-hooks-dir pyinstaller_hooks --name=test --hidden-import timed_auth_token.authentication --hidden-import server.page --key test manage.py
pyinstaller --clean test.spec
```

- 最后运行后台exe `./dist/test.exe runserver localhost:8000`，nginx配置好后，访问 `localhost:8008`即可看到运行不再报错。